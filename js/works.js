document.addEventListener('DOMContentLoaded', () => {
    // 페이지 로드 시 초기화 코드를 여기에 작성합니다
    console.log('Works 페이지가 로드되었습니다.');

    // 프로젝트별 폴더명과 설명 매핑
    const projects = [
        {
            key: 'shade-of-blue',
            folder: 'shade-of-blue',
        },
        {
            key: 'the-faceless',
            folder: 'the-faceless',
        }
    ];

    projects.forEach(project => {
        const galleryCol = document.querySelector(`.project-gallery-col[data-project="${project.key}"]`);
        if (!galleryCol) return;
        // API로 이미지 목록 받아오기
        fetch(`/api/images?folder=webp/${project.folder}`)
            .then(res => res.json())
            .then(images => {
                // 이미지가 충분하면 랜덤 8~12장, 아니면 전부
                const shuffled = images.sort(() => Math.random() - 0.5);
                const showCount = Math.min(shuffled.length, Math.floor(Math.random() * 5) + 8); // 8~12장
                shuffled.slice(0, showCount).forEach(imgPath => {
                    const img = document.createElement('img');
                    img.src = imgPath;
                    img.alt = project.folder + ' image';
                    galleryCol.appendChild(img);
                });
            })
            .catch(() => {
                galleryCol.innerHTML = '<p style="color:#aaa">이미지를 불러올 수 없습니다.</p>';
            });
    });
}); 