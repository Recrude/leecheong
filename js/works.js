document.addEventListener('DOMContentLoaded', () => {
    // 페이지 로드 시 초기화 코드를 여기에 작성합니다
    console.log('Works 페이지가 로드되었습니다.');

    // 프로젝트별 이미지 리스트 (public/images/webp/프로젝트명/파일명)
    const imageList = {
        'shade-of-blue': [
            '/images/webp/shade-of-blue/shade-of-blue_1-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_2-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_3-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_4-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_5-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_6-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_7-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_8-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_9-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_10-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_11-min.webp',
            '/images/webp/shade-of-blue/shade-of-blue_12-min.webp'
        ],
        'the-faceless': [
            '/images/webp/the-faceless/the-faceless_1-min.webp',
            '/images/webp/the-faceless/the-faceless_2-min.webp',
            '/images/webp/the-faceless/the-faceless_3-min.webp',
            '/images/webp/the-faceless/the-faceless_4-min.webp',
            '/images/webp/the-faceless/the-faceless_5-min.webp',
            '/images/webp/the-faceless/the-faceless_6-min.webp',
            '/images/webp/the-faceless/the-faceless_7-min.webp',
            '/images/webp/the-faceless/the-faceless_8-min.webp',
            '/images/webp/the-faceless/the-faceless_9-min.webp',
            '/images/webp/the-faceless/the-faceless_10-min.webp',
            '/images/webp/the-faceless/the-faceless_11-min.webp',
            '/images/webp/the-faceless/the-faceless_12-min.webp'
        ]
    };

    Object.keys(imageList).forEach(project => {
        const galleryCol = document.querySelector(`.project-gallery-col[data-project="${project}"]`);
        if (!galleryCol) return;
        // 이미지 랜덤 섞기
        const shuffled = imageList[project].slice().sort(() => Math.random() - 0.5);
        const showCount = Math.min(shuffled.length, Math.floor(Math.random() * 5) + 8); // 8~12장
        shuffled.slice(0, showCount).forEach(imgPath => {
            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = project + ' image';
            galleryCol.appendChild(img);
        });
    });
}); 