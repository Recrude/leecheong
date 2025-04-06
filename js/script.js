// 이미지 데이터
const imageFolders = [
    '/images/webp/shade-of-blue',
    '/images/webp/the-faceless',
    '/images/webp/pigeon-hunting',
    '/images/webp/imperfect-financier'
];

// 이미지 파일 목록을 저장할 배열
let allImages = [];
let displayedImages = [];
let currentImageIndex = 0;
let isLoading = false;
let columnCount = 1; // 초기 열 수는 1로 설정
let isInitialLoad = true; // 초기 로딩 여부
let gridAnimationInterval; // 그리드 애니메이션 인터벌

// DOM 요소
const imageGrid = document.getElementById('image-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const galleryModal = document.getElementById('gallery-modal');
const galleryImage = document.getElementById('gallery-image');
const galleryClose = document.getElementById('gallery-close');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const gridToggle = document.getElementById('grid-toggle');
const loadingPage = document.getElementById('loading-page');

// 이미지 파일 목록 가져오기
async function fetchImageList() {
    try {
        // 각 폴더에서 이미지 파일 목록 가져오기
        const imagePromises = imageFolders.map(folder => {
            return fetch(`/api/images?folder=${encodeURIComponent(folder)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error(`Failed to fetch images from ${folder}:`, error);
                    return [];
                });
        });

        const folderResults = await Promise.all(imagePromises);
        
        // 모든 이미지 파일 경로를 하나의 배열로 합치기
        allImages = folderResults.flat().map(imagePath => ({
            path: imagePath,
            folder: imagePath.split('/')[3] // 폴더 이름 추출
        }));
        
        // 이미지 배열 섞기
        shuffleArray(allImages);
        
        // 초기 이미지 로드 (더 많은 이미지 로드)
        loadMoreImages(50);
        
        // 초기 로딩 애니메이션 시작
        startInitialAnimation();
    } catch (error) {
        console.error('Error fetching image list:', error);
        // 오류 발생 시 대체 이미지 로드
        loadFallbackImages();
    }
}

// 초기 로딩 애니메이션 시작
function startInitialAnimation() {
    // 로딩 페이지 표시
    loadingPage.classList.remove('hidden');
    
    // 1초 후 로딩 페이지 페이드아웃
    setTimeout(() => {
        loadingPage.classList.add('fade-out');
        
        // 페이드아웃 완료 후 로딩 페이지 숨김
        setTimeout(() => {
            loadingPage.classList.add('hidden');
            
            // 이미지 그리드 표시
            imageGrid.classList.add('loaded');
            
            // 그리드 열 변환 애니메이션 시작
            startGridColumnAnimation();
        }, 1000);
    }, 1000);
}

// 그리드 열 변환 애니메이션 시작
function startGridColumnAnimation() {
    let currentColumn = 1;
    
    // 2초 동안 1열부터 10열까지 순차적으로 변경
    gridAnimationInterval = setInterval(() => {
        currentColumn++;
        if (currentColumn > 10) {
            clearInterval(gridAnimationInterval);
            columnCount = 10; // 최종적으로 10열로 설정
            changeGridColumns(10);
            isInitialLoad = false;
            return;
        }
        
        changeGridColumns(currentColumn);
    }, 2000 / 9); // 2초를 9단계로 나눔 (1->2->3->4->5->6->7->8->9->10)
}

// 대체 이미지 로드 (API 오류 시)
function loadFallbackImages() {
    // 하드코딩된 이미지 경로 (예시)
    const fallbackImages = [
        { path: '/src/images/webp/shade-of-blue/shade-of-blue_1-min.webp', folder: 'shade-of-blue' },
        { path: '/src/images/webp/the-faceless/the-faceless_1-min.webp', folder: 'the-faceless' },
        { path: '/src/images/webp/pigeon-hunting/pigeon-hunting_1-min.webp', folder: 'pigeon-hunting' },
        { path: '/src/images/webp/imperfect-financier/imperfect-financier_1-min.webp', folder: 'imperfect-financier' }
    ];
    
    allImages = fallbackImages;
    loadMoreImages(50);
    startInitialAnimation();
}

// 배열 섞기 함수 (Fisher-Yates 알고리즘)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 이미지 요소 생성
function createImageElement(imageData) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    
    const img = document.createElement('img');
    img.src = imageData.path;
    img.alt = `이청의 사진 - ${imageData.folder}`;
    img.loading = 'lazy'; // 지연 로딩 적용
    
    // 이미지 로드 오류 처리
    img.onerror = function() {
        console.error(`이미지 로드 실패: ${imageData.path}`);
        this.src = '/src/images/placeholder.webp'; // 대체 이미지
    };
    
    // 이미지 로드 완료 시 애니메이션 적용
    img.onload = function() {
        setTimeout(() => {
            imageItem.classList.add('loaded');
        }, Math.random() * 500); // 랜덤한 지연 시간으로 자연스러운 애니메이션
    };
    
    imageItem.appendChild(img);
    
    // 이미지 클릭 이벤트
    imageItem.addEventListener('click', () => {
        openGallery(imageData.path);
    });
    
    return imageItem;
}

// 더 많은 이미지 로드
function loadMoreImages(count = 20) {
    if (isLoading || displayedImages.length >= allImages.length) return;
    
    isLoading = true;
    loadingIndicator.classList.add('active');
    
    // 다음 이미지 가져오기
    const nextImages = allImages.slice(displayedImages.length, displayedImages.length + count);
    
    // 이미지 요소 생성 및 추가
    nextImages.forEach(imageData => {
        const imageElement = createImageElement(imageData);
        imageGrid.appendChild(imageElement);
        displayedImages.push(imageData);
    });
    
    isLoading = false;
    loadingIndicator.classList.remove('active');
}

// 갤러리 뷰 열기
function openGallery(imagePath) {
    galleryImage.src = imagePath;
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
    
    // 현재 이미지 인덱스 찾기
    currentImageIndex = displayedImages.findIndex(img => img.path === imagePath);
}

// 갤러리 뷰 닫기
function closeGallery() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = ''; // 스크롤 복원
}

// 이전 이미지로 이동
function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        galleryImage.src = displayedImages[currentImageIndex].path;
    }
}

// 다음 이미지로 이동
function nextImage() {
    if (currentImageIndex < displayedImages.length - 1) {
        currentImageIndex++;
        galleryImage.src = displayedImages[currentImageIndex].path;
    } else {
        // 더 많은 이미지 로드
        loadMoreImages(10);
    }
}

// 그리드 열 변경
function changeGridColumns(targetColumns = null) {
    if (targetColumns) {
        columnCount = targetColumns;
    } else {
        columnCount = columnCount >= 10 ? 1 : columnCount + 1;
    }
    
    // 그리드 클래스 업데이트 (loaded 클래스 유지)
    const currentClasses = imageGrid.className.split(' ');
    const loadedClass = currentClasses.includes('loaded') ? 'loaded' : '';
    
    // 모든 columns- 클래스 제거
    currentClasses.forEach(className => {
        if (className.startsWith('columns-')) {
            imageGrid.classList.remove(className);
        }
    });
    
    // 기본 클래스와 loaded 클래스 설정
    imageGrid.className = 'image-grid';
    if (loadedClass) {
        imageGrid.classList.add(loadedClass);
    }
    
    // 새로운 columns- 클래스 추가
    imageGrid.classList.add(`columns-${columnCount}`);
    
    // 버튼 텍스트 업데이트
    gridToggle.textContent = columnCount;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 스크롤 이벤트 (무한 스크롤)
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
            loadMoreImages();
        }
    });
    
    // 갤러리 닫기 버튼
    galleryClose.addEventListener('click', closeGallery);
    
    // 갤러리 오버레이 클릭 시 닫기
    document.querySelector('.gallery-overlay').addEventListener('click', closeGallery);
    
    // 갤러리 네비게이션 버튼
    galleryPrev.addEventListener('click', prevImage);
    galleryNext.addEventListener('click', nextImage);
    
    // 키보드 이벤트
    document.addEventListener('keydown', (e) => {
        if (galleryModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeGallery();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
    
    // 그리드 열 수 변경 버튼
    gridToggle.addEventListener('click', () => changeGridColumns());
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    fetchImageList();
    setupEventListeners();
    
    // 초기 열 수 설정
    imageGrid.classList.add(`columns-${columnCount}`);
    gridToggle.textContent = `${columnCount}열`;
}); 