const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use(express.static('./'));

// 이미지 목록 API
app.get('/api/images', (req, res) => {
    const folder = req.query.folder;
    
    if (!folder) {
        return res.status(400).json({ error: '폴더 경로가 필요합니다.' });
    }
    
    try {
        // 폴더 내의 모든 파일 목록 가져오기
        const files = fs.readdirSync(folder);
        
        // .webp 파일만 필터링
        const imageFiles = files.filter(file => file.endsWith('.webp'));
        
        // 전체 경로로 변환
        const imagePaths = imageFiles.map(file => `/${folder}/${file}`);
        
        res.json(imagePaths);
    } catch (error) {
        console.error(`폴더 읽기 오류: ${folder}`, error);
        res.status(500).json({ error: '폴더를 읽는 중 오류가 발생했습니다.' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 