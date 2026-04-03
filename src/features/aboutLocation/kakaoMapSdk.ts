export interface KakaoMapsAddressSearchResult {
  x: string;
  y: string;
}

export interface KakaoMapsSdk {
  maps: {
    LatLng: new (latitude: number, longitude: number) => unknown;
    Map: new (
      container: HTMLElement,
      options: {
        center: unknown;
        level: number;
      },
    ) => unknown;
    Marker: new (options: { map: unknown; position: unknown }) => unknown;
    load: (callback: () => void) => void;
    services: {
      Geocoder: new () => {
        addressSearch: (
          address: string,
          callback: (result: KakaoMapsAddressSearchResult[], status: string) => void,
        ) => void;
      };
      Status: {
        OK: string;
      };
    };
  };
}

declare global {
  interface Window {
    kakao?: KakaoMapsSdk;
  }
}

const KAKAO_MAP_SCRIPT_ID = 'kakao-map-sdk';
const KAKAO_MAP_SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js';

let kakaoMapSdkPromise: Promise<KakaoMapsSdk> | null = null;

const buildKakaoMapSdkUrl = (appKey: string) => {
  const searchParams = new URLSearchParams({
    appkey: appKey,
    autoload: 'false',
    libraries: 'services',
  });

  return `${KAKAO_MAP_SDK_URL}?${searchParams.toString()}`;
};

export const loadKakaoMapSdk = (appKey: string) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window 객체를 사용할 수 없는 환경입니다.'));
  }

  if (!appKey.trim()) {
    return Promise.reject(new Error('카카오 지도 API 키가 설정되지 않았습니다.'));
  }

  const kakao = window.kakao;

  if (typeof kakao !== 'undefined') {
    return Promise.resolve(kakao);
  }

  if (kakaoMapSdkPromise) {
    return kakaoMapSdkPromise;
  }

  kakaoMapSdkPromise = new Promise<KakaoMapsSdk>((resolve, reject) => {
    const resolveSdk = () => {
      const kakao = window.kakao;

      if (typeof kakao === 'undefined') {
        kakaoMapSdkPromise = null;
        reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'));
        return;
      }

      kakao.maps.load(() => {
        resolve(kakao);
      });
    };

    const handleError = () => {
      kakaoMapSdkPromise = null;
      reject(new Error('카카오 지도 스크립트 로드에 실패했습니다.'));
    };

    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);

    if (existingScript instanceof HTMLScriptElement) {
      if (existingScript.dataset['loaded'] === 'true') {
        resolveSdk();
        return;
      }

      existingScript.addEventListener(
        'load',
        () => {
          existingScript.dataset['loaded'] = 'true';
          resolveSdk();
        },
        { once: true },
      );
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');

    script.id = KAKAO_MAP_SCRIPT_ID;
    script.async = true;
    script.src = buildKakaoMapSdkUrl(appKey);
    script.addEventListener(
      'load',
      () => {
        script.dataset['loaded'] = 'true';
        resolveSdk();
      },
      { once: true },
    );
    script.addEventListener('error', handleError, { once: true });

    document.head.append(script);
  });

  return kakaoMapSdkPromise;
};
