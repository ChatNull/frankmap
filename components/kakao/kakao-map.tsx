"use client";
import { CustomOverlayMap, Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "../../hooks/useKakaoLoader";
import EventMarkerContainer from "./handle-marker";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { FilteredData } from "../../atoms/atoms";
import GetGeolocation from "./get-geolocation";

function debounce<T extends (...args: any[]) => void>(callback: T, limit = 500): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), limit);
  };
}

const KakaoMap = ({ data }: { data: RecordType[] }) => {
  useKakaoLoader();
  const mapRef = useRef<kakao.maps.Map>(null);
  const [map, setMap] = useState(mapRef.current);

  const [bounds, setBounds] = useState<{ sw: string; ne: string }>({ sw: "", ne: "" });
  const [filteredData, setFilteredData] = useRecoilState(FilteredData);
  const [position, setPosition] = useState<Latlng>({
    // 위치 확인 허용하지 않은 경우 기본 위치(서울역) 설정
    lat: 37.5546788388674,
    lng: 126.970606917394,
  });
  const [isShowCenter, setIsShowCenter] = useState(false);
  const [centerMarker, setCenterMarker] = useState<Latlng>(position);

  const filterDataFn = () => {
    // bounds가 변경되면 해당 bounds에 해당하는 데이터만 필터링
    if (bounds?.sw && bounds?.ne) {
      const swLatLng = bounds.sw.slice(1, -1).split(", ").map(Number);
      const neLatLng = bounds.ne.slice(1, -1).split(", ").map(Number);

      const swLat = swLatLng[0];
      const swLng = swLatLng[1];
      const neLat = neLatLng[0];
      const neLng = neLatLng[1];

      const newFilteredData = data.filter((marker) => {
        const lat = marker.latlng.lat;
        const lng = marker.latlng.lng;
        return lat >= swLat && lat <= neLat && lng >= swLng && lng <= neLng;
      });
      setFilteredData(newFilteredData);
    }
  };

  const [search, setSearch] = useState("");
  const [searchedData, setSearchedData] = useState<{ content: string; latlng: Latlng }[]>([]);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsShowCenter(false);
    const ps = new kakao.maps.services.Places();

    // 키워드 검색 및 지도 반경 이동
    ps.keywordSearch(search, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];

        for (var i = 0; i < data.length; i++) {
          markers.push({
            latlng: {
              lat: +data[i].y,
              lng: +data[i].x,
            },
            content: data[i].place_name,
          });
          bounds.extend(new kakao.maps.LatLng(+data[i].y, +data[i].x));
        }
        setSearchedData(markers);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map!.setBounds(bounds);
      } else if (status === "ZERO_RESULT") {
        // 검색 결과가 없는 경우
        console.log(`${search} 검색 결과가 없습니다.`);
        setSearchedData([]);
        setSearch("");
      }
    });
  };

  const handleEmotionAdd = () => {
    // @ts-ignore
    const { Ma: lat, La: lng } = map.getCenter();
    setCenterMarker({ lat, lng });
    setIsShowCenter(true);
  };

  // 사용자의 현재 위치 반영
  useEffect(() => {
    GetGeolocation(setPosition);
  }, []);

  // 현재 위치의 bounds 설정
  useEffect(() => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      setBounds({
        sw: bounds.getSouthWest().toString(),
        ne: bounds.getNorthEast().toString(),
      });
    }
  }, [mapRef.current]);

  // 위치에 따른 filteredData 변경
  useEffect(() => {
    // debounce(() => filterDataFn(), 500);
    filterDataFn();
  }, [bounds]);

  return (
    <>
      <Map
        key={`kakaoMap`}
        center={{ lat: position.lat, lng: position.lng }}
        style={{ width: "100%", height: "100vh" }}
        ref={mapRef}
        onCreate={(map) => setMap(map)}
        onBoundsChanged={(map) => {
          const bounds = map.getBounds();
          setBounds({
            sw: bounds.getSouthWest().toString(),
            ne: bounds.getNorthEast().toString(),
          });
          debounce(() => {}, 500);
        }}
        onDragEnd={(map) => {
          // @ts-ignore
          const { Ma: lat, La: lng } = map.getCenter();
          setCenterMarker({ lat, lng });
        }}
        onClick={(_, mouseEvent) => {
          // @ts-ignore
          const { Ma: lat, La: lng } = mouseEvent.latLng;
          setCenterMarker({ lat, lng });
          map!.setCenter(new kakao.maps.LatLng(lat, lng));
        }}
      >
        {/* 지도 중심 마커가 표시되는 경우 */}
        {isShowCenter && (
          <>
            <CustomOverlayMap key={`overlay-center`} position={centerMarker}>
              <p className="markerContent">감정 추가</p>
            </CustomOverlayMap>
            <EventMarkerContainer
              type="center"
              key={`중심마커`}
              position={centerMarker}
              setIsShowCenter={setIsShowCenter}
            />
          </>
        )}
        {search
          ? searchedData.map((marker) => (
              // 검색된 결과가 있는 경우
              <>
                <CustomOverlayMap
                  key={`overlay-${marker.latlng.lat}-${marker.latlng.lng}`}
                  position={{
                    lat: +marker.latlng.lat,
                    lng: +marker.latlng.lng,
                  }}
                >
                  <p className="markerContent">{marker.content}</p>
                </CustomOverlayMap>
                <EventMarkerContainer
                  type="search"
                  key={`marker-${marker.latlng.lat}-${marker.latlng.lng}`}
                  position={marker.latlng}
                  setIsShowCenter={setIsShowCenter}
                />
              </>
            ))
          : filteredData.map((marker: RecordType) => (
              // 등록된 감정 데이터가 있는 경우
              <>
                <EventMarkerContainer
                  type="default"
                  key={`${marker.latlng.lat}-${marker.latlng.lng}-${marker["created_at"]}`}
                  position={marker.latlng}
                  emotion={marker.emotion}
                  setIsShowCenter={setIsShowCenter}
                />
              </>
            ))}
      </Map>
      <button className="emotionAdd" onClick={handleEmotionAdd}>
        <span className="hidden">감정 추가</span>
      </button>
      <form onSubmit={(e) => handleSearch(e)} className="searchWr">
        <input type="text" id="search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button>
          <span className="hidden">검색</span>
        </button>
      </form>
    </>
  );
};

export default KakaoMap;
