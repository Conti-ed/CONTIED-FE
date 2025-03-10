# Conti:ed

<div align="center">
<img alt="image" src="https://github.com/Conti-ed/client/blob/main/public/images/fulllogo_light.png?raw=true">
<img alt="image" src="https://github.com/Conti-ed/client/blob/main/public/images/fulllogo_dark.png?raw=true">
</div>

## Conti:ed (1차 배포 완료) 📅
> **1차 개발 기간: 2024.01 ~ 2024.11**

## 관련 링크 🔗

> **개발 버전** : [client-20h.pages.dev/](client-20h.pages.dev/) <br>
> **기록 일지** : [https://www.notion.so/Conti-ed-8e533187ef4d4d5e90b3916aac7101f5?pvs=4](https://www.notion.so/Conti-ed-8e533187ef4d4d5e90b3916aac7101f5?pvs=4) <br>

## 프로젝트 소개 🫱🏻‍🫲🏻

<img alt="image" src="https://github.com/Conti-ed/client/blob/main/public/images/Contied_작품설명.png?raw=true">

- 콘티는 영화 등의 촬영을 위하여 각본을 바탕으로 필요한 모든 사항을 기록한 것을 의미합니다. <br>
Conti:ed 서비스에서의 콘티는 교회 및 밴드에서 진행되는 콘서트 형식의 곡들이 어떻게 진행되어 가는지를 상세히 기록하기 위해 사용됩니다. <br>

- 팀 리더와 팀원들 간의 **소통을 원활히** 하기 위해 콘티가 업데이트되는 사항을 즉각적으로 확인할 수 있는 서비스입니다. <br>
이에 더해 콘티 작성에 어려움을 느끼는 팀 리더들에게 **콘티를 생성해주고 추천**해주는 시스템도 추가될 예정입니다. <br>

#### Conti in Conti:ed
- Conti is a term utilized in film and various other types of production. <br>
It denotes a document that records all necessary details based on a script. <br>
- At Conti:ed service, Conti is utilized to meticulously document the progression of concert-style songs performed by churches and bands.

#### A Conti Sharing and Creation Service for Leaders

- This service is aimed at facilitating seamless communication between team leaders and members. <br>
It ensures immediate access to updates made to the Conti.
- Moreover, the system is set to incorporate new features soon. <br>
These features will aid team leaders who struggle with creating Conti by generating and recommending it for them.

## 시작 가이드 🛫
### Requirements
For building and running the application you need:

- [React 18.2.0]
- [Django 5.0]
- [ytmusicapi 1.4.2]

### Installation
``` bash
$ git clone https://github.com/
$ cd 
```
#### Backend
```
$ cd 
$ npm install
$ npm run develop
```

#### Frontend
```
$ cd
$ npm install
$ npm start
```

---

## Stacks 🐈

### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)             

### Config
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)        

### Development
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![ytmusicapi](https://img.shields.io/badge/ytmusicapi-FF0000?style=for-the-badge&logo=youtubemusic&logoColor=white)
![Material UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=MUI&logoColor=white)

### Communication
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)
![Zoom](https://img.shields.io/badge/Zoom-0B5CFF?style=for-the-badge&logo=Zoom&logoColor=white)

---
## 화면 구성 📺
| Main Page  |  My Conti Page   | Conti Detail Page   |
| :-------------------------------------------: | :------------: | :------------: |
| <img height="550" borderRadius="5px" src="https://github.com/Conti-ed/client/blob/main/public/images/homePage.png"/> | <img height="550" src="https://github.com/Conti-ed/client/blob/main/public/images/myContiPage.png"/>| <img height="550" src="https://github.com/Conti-ed/client/blob/main/public/images/contiDetailPage.png"/>|
| **Upload Page** | **Search Page** | **Settings Page** |  
| <img height="550" src="https://github.com/Conti-ed/client/blob/main/public/images/uploadPage.png"/> | <img height="550" src="https://github.com/Conti-ed/client/blob/main/public/images/searchPage.png"/> | <img height="550" src="https://github.com/Conti-ed/client/blob/main/public/images/settingsPage.png"/> |


---
## 주요 기능 📦

### ⭐️ 로그인 및 자신의 콘티 작성
- 로그인 후, 자신의 콘티를 업로드하거나 나만의 콘티 작성 가능

### ⭐️ 콘티, 곡, 키워드들의 기본적인 CRUD
- 콘티, 곡, 콘티 내 키워드를 생성, 수정, 삭제 가능
- 다른 사용자들의 콘티에서 곡을 가져오기도 가능

### ⭐️ Youtube 재생목록을 이용한 콘티 공유 기능
- 업로드 시, Youtube 재생목록 링크를 첨부하면 해당 재생목록의 곡들을 콘티에 추가 가능

---
## 아키텍쳐

### 디렉토리 구조
```bash
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── images : 로고 및 기타 이미지 저장 폴더
│   │   ├── logo.png
│   │   ├── placeholder.png
│   └── └── login.png
└── src : 프론트엔드
    ├── components
    │   ├── StatusBar.tsx : IOS 헤더
    │   ├── EmptyState.tsx : 특정 요소가 없을 경우
    │   ├── ContiPlaceholder.tsx
    │   ├── AlbumPlaceholder.tsx
    │   ├── SongPlaceholder.tsx
    │   ├── SafariSpace.tsx : IOS footer
    │   ├── InputSafariSpace.tsx : 입력 시 IOS footer
    │   ├── Keyboard.tsx : IOS 키보드
    │   ├── TabBar.tsx : 페이지 하단 옵션 바
    │   ├── SongItem.tsx : 곡 상세 정보
    │   ├── SongList.tsx : 곡 리스트
    │   └── Uploads : 업로드 관련
    │       ├── CustomUpload.tsx : 커스텀 콘티 생성 관리
    │       ├── AIUpload.tsx : AI 콘티 생성 관리
    │       └── YouTubeUpload.tsx : 유튜브 콘티 생성 관리
    │   └── Tabs : 검색 결과 탭 관련
    │       ├── AllTab.tsx : 전체 탭 관리
    │       ├── SongsTab.tsx : 곡 탭 관리
    │       ├── ContiTab.tsx : 콘티 탭 관리
    │       └── LyricsTab.tsx : 가사 탭 관리
    ├── Routes
    │   ├── Start.tsx : 시작 페이지
    │   ├── Wait.tsx : 로그인 대기 페이지
    │   ├── Home.tsx : 메인 페이지
    │   ├── Search.tsx : 검색 페이지
    │   ├── Result.tsx : 검색 결과 페이지
    │   ├── MyPage.tsx : 설정 및 관리 페이지
    │   └── ContiDetail.tsx : 콘티 상세 페이지
    ├── utils
    │   └── formatDuration.ts : 시간 포맷 설정
    ├── styles
    │   ├── Home.styles.ts
    │   ├── TabBar.styles.ts
    │   └── LoadingSpinner.styles.ts : 로딩 시 출력되는 화면
    ├── Router.tsx : 이동 로직 관리
    ├── Root.tsx
    ├── index.tsx
    ├── api.ts : API 관리
    ├── atoms.ts
    └── types.ts

```
---

## 기타 사항 (Getting Started with Create React App)

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

- In the project directory, you can run:

#### `npm start`

- Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

- Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

- Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

- The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

- See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

- **Note: this is a one-way operation. Once you `eject`, you can’t go back!**

- If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

- Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

- You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

- You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

- To learn React, check out the [React documentation](https://reactjs.org/).
