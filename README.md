# HelenKeller-Frontend

이 Repository는 항해커톤 2024 14팀의 시각장애인 보조 AI 서비스인 '헬렌켈러'의 React 기반 프론트엔드 부분입니다.

## Key Features
- 백엔드로 프론트에 이미지와 프롬프트를 입력받아 AI 모델 및 API를 이용하여 프롬프트에 맞게 분석 후 결과를 리턴
    - [TTS]() 
    - [STT]()
    - [Network]()

## Getting started

### Pre-requisites
- react 18 이상

### Installation

1. Clone the repository:
```bash
https://github.com/hanghae-hackathon/Helenkeller-Frontend.git
```

2. Install dependencies:
```bash
npm run build
```


### Running the application
```bash
npm run dev
```

## API References

- `POST /uploadfile/` - 프롬프트 및 이미지를 입력받아 AI 모델로 분석 후 결과값을 String 형태로 반환

Additional references:
* [Getting started with Vite](https://vitejs.dev/guide/)
* [Tailwind documentation](https://tailwindcss.com/docs/installation)

