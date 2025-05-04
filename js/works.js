$(function() {
    // 서브 메뉴 동작
    $('.submenu-btn').on('click', function() {
        var target = $(this).data('target');
        // 버튼 active 처리
        $('.submenu-btn').removeClass('active');
        $(this).addClass('active');
        // 섹션 표시/숨김
        $('.submenu-content').hide();
        $('#' + target).show();
    });

    // 페이지 진입 시 PHOTOS가 먼저 보이도록 강제
    $('.submenu-btn[data-target="photos-section"]').addClass('active');
    $('.submenu-btn[data-target="books-section"]').removeClass('active');
    $('#photos-section').show();
    $('#books-section').hide();
});

document.addEventListener('DOMContentLoaded', () => {
    // 모든 프로젝트를 위한 이미지 폴더 매핑
    const projectFolders = {
        'glass-eye': 'glass-eye',
        'the-faceless': 'the-faceless',
        'shade-of-blue': 'shade-of-blue',
        'imperfect-jeonju': 'imperfect-jeonju'
    };

    // 각 프로젝트별 이미지 목록을 저장할 객체
    const projectImages = {};
    
    // 각 프로젝트별 현재 인덱스와 로드된 이미지 수 추적
    const projectState = {};
    
    // 각 프로젝트 슬라이더 초기화
    Object.keys(projectFolders).forEach(project => {
        // 초기에는 빈 배열로 설정
        projectImages[project] = [];
        projectState[project] = {
            currentIndex: 0,
            loadedImages: 0
        };
        
        // 이미지 목록 구성 및 슬라이더 초기화
        loadImagesForProject(project);
    });

    // 프로젝트별 이미지 로드 함수
    function loadImagesForProject(projectId) {
        const galleryCol = document.querySelector(`.project-gallery-col[data-project="${projectId}"]`);
        if (!galleryCol) return;
        
        const sliderContainer = galleryCol.querySelector('.slider-container');
        const prevBtn = galleryCol.querySelector('.prev-btn');
        const nextBtn = galleryCol.querySelector('.next-btn');
        
        if (!sliderContainer || !prevBtn || !nextBtn) return;
        
        // 테스트용 이미지 배열 (실제로는 서버에서 가져와야 함)
        let imagePaths = [];
        
        // 프로젝트별 예상 이미지 수 (실제로는 이런 예측이 필요 없음)
        const expectedImageCount = {
            'glass-eye': 100,
            'the-faceless': 50, 
            'shade-of-blue': 30,
            'imperfect-jeonju': 20
        };
        
        // 테스트용 이미지 경로 생성
        for (let i = 1; i <= expectedImageCount[projectId]; i++) {
            imagePaths.push(`/src/images/webp/${projectFolders[projectId]}/${projectFolders[projectId]}_${i}-min.webp`);
        }
        
        // 이미지 배열 섞기
        imagePaths = shuffleArray(imagePaths);
        
        // 프로젝트 이미지 목록에 저장
        projectImages[projectId] = imagePaths;
        
        // 처음 10개 이미지 로드
        loadMoreImages(projectId, 5);
        
        // 이전 이미지 버튼 클릭 이벤트
        prevBtn.addEventListener('click', () => {
            if (projectState[projectId].currentIndex > 0) {
                projectState[projectId].currentIndex--;
                updateSlider(projectId);
            }
        });

        // 다음 이미지 버튼 클릭 이벤트
        nextBtn.addEventListener('click', () => {
            if (projectImages[projectId].length > 0 && 
                projectState[projectId].currentIndex < projectState[projectId].loadedImages - 1) {
                projectState[projectId].currentIndex++;
                updateSlider(projectId);
                
                // 끝에 가까워지면 더 많은 이미지 로드
                if (projectState[projectId].currentIndex >= projectState[projectId].loadedImages - 2) {
                    loadMoreImages(projectId, 3);
                }
            }
        });
    }
    
    // 더 많은 이미지 로드 함수
    function loadMoreImages(projectId, count) {
        const galleryCol = document.querySelector(`.project-gallery-col[data-project="${projectId}"]`);
        if (!galleryCol) return;
        
        const sliderContainer = galleryCol.querySelector('.slider-container');
        if (!sliderContainer) return;
        
        const currentLoadedCount = sliderContainer.children.length;
        const projectImageList = projectImages[projectId];
        let imagesAdded = 0;
        
        // 아직 로드되지 않은 이미지 중에서 count만큼 로드
        for (let i = 0; i < count; i++) {
            const index = currentLoadedCount + i;
            if (index < projectImageList.length) {
                const img = document.createElement('img');
                img.src = projectImageList[index];
                img.alt = `${projectId} image ${index + 1}`;
                img.loading = 'lazy'; // 지연 로딩 적용
                
                // 이미지가 로드되면 슬라이더 업데이트
                img.onload = function() {
                    // 첫 번째 이미지가 로드되면 활성화
                    if (sliderContainer.children.length === 1) {
                        img.style.display = 'block';
                    } else {
                        img.style.display = 'block';
                    }
                };
                
                img.onerror = function() {
                    // 이미지 로드 실패 시 대체 이미지나 오류 처리
                    img.src = 'https://dummyimage.com/600x400/cccccc/ffffff&text=Image+Not+Found';
                    img.style.display = 'block';
                };
                
                sliderContainer.appendChild(img);
                imagesAdded++;
            }
        }
        
        // 로드된 이미지 수 업데이트
        projectState[projectId].loadedImages = currentLoadedCount + imagesAdded;
        
        // 처음 이미지가 로드되면 슬라이더 초기화
        if (currentLoadedCount === 0 && imagesAdded > 0) {
            updateSlider(projectId);
        }
    }
    
    // 슬라이더 위치 업데이트
    function updateSlider(projectId) {
        const galleryCol = document.querySelector(`.project-gallery-col[data-project="${projectId}"]`);
        if (!galleryCol) return;
        
        const sliderContainer = galleryCol.querySelector('.slider-container');
        if (!sliderContainer) return;
        
        const currentIndex = projectState[projectId].currentIndex;
        sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // 배열을 무작위로 섞는 함수
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}); 