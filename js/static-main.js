document.addEventListener('DOMContentLoaded', () => {
    // 변수 초기화
    let columnCount = 1;
    let isInitialLoad = true;
    let gridAnimationInterval;
    
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
    
    // 이미지 경로 배열 (실제 파일명 모두 추가)
    const imageList = [
        // 예시
        "/images/webp/shade-of-blue/shade-of-blue_1-min.webp",
        "/images/webp/shade-of-blue/shade-of-blue_2-min.webp",
        // ... (모든 파일명)
    ];
    
    // Fisher-Yates 셔플
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // 1. 이미지 그리드에 동적으로 이미지 삽입
    function renderImages() {
        imageGrid.innerHTML = '';
        const images = [...imageList];
        shuffle(images);
        images.forEach(src => {
            const div = document.createElement('div');
            div.className = 'image-item';
            const img = document.createElement('img');
            img.src = src;
            img.alt = '이청의 사진';
            img.loading = 'lazy';
            div.appendChild(img);
            imageGrid.appendChild(div);
        });
    }
    
    // 2. 이미지 삽입 후, 갤러리/애니메이션/이벤트 연결
    let allImages = [];
    let currentImageIndex = 0;
    function setupImageEvents() {
        const allImageItems = document.querySelectorAll('.image-item');
        allImages = Array.from(allImageItems).map(item => ({
            element: item,
            path: item.querySelector('img').src
        }));
        allImageItems.forEach((imageItem, idx) => {
            const img = imageItem.querySelector('img');
            if (img.complete) {
                setTimeout(() => {
                    imageItem.classList.add('loaded');
                }, Math.random() * 500);
            } else {
                img.onload = function() {
                    setTimeout(() => {
                        imageItem.classList.add('loaded');
                    }, Math.random() * 500);
                };
            }
            imageItem.addEventListener('click', () => {
                openGallery(img.src);
            });
        });
    }
    
    // 갤러리 뷰 열기
    function openGallery(imagePath) {
        galleryImage.src = imagePath;
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 스크롤 방지
        currentImageIndex = allImages.findIndex(img => img.path === imagePath);
    }
    
    // 갤러리 뷰 닫기
    function closeGallery() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 이전 이미지로 이동
    function prevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            galleryImage.src = allImages[currentImageIndex].path;
        }
    }
    
    // 다음 이미지로 이동
    function nextImage() {
        if (currentImageIndex < allImages.length - 1) {
            currentImageIndex++;
            galleryImage.src = allImages[currentImageIndex].path;
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
    
    // 초기 로딩 애니메이션
    function startInitialAnimation() {
        // 로딩 페이지 표시
        loadingPage.style.display = 'flex';
        
        // 이미지 로드가 완료되면 슬라이드 업 애니메이션 실행
        setTimeout(() => {
            loadingPage.classList.add('slide-up');
            
            // 애니메이션 완료 후 로딩 페이지 숨기기
            setTimeout(() => {
                loadingPage.style.display = 'none';
                loadingPage.classList.remove('slide-up');
                
                // 이미지 그리드 표시
                imageGrid.classList.add('loaded');
                
                // 그리드 열 변환 애니메이션 시작
                startGridColumnAnimation();
            }, 1000);
        }, 1500);
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
    
    // 이벤트 리스너 설정
    function setupEventListeners() {
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
    
    // 페이지 초기화
    renderImages();
    setupImageEvents();
    startInitialAnimation();
    setupEventListeners();
}); 