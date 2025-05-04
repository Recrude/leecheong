const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3003;

// 에러 핸들러 미들웨어
app.use((err, req, res, next) => {
    console.error('서버 에러:', err);
    res.status(500).send('서버 내부 오류가 발생했습니다.');
});

// 정적 파일 제공
app.use('/', express.static(path.join(__dirname)));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// index.html 제공
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        console.error('index.html 로드 실패:', error);
        res.status(500).send('페이지를 로드할 수 없습니다.');
    }
});

// 이미지 목록 API
app.get('/api/images', (req, res) => {
    const folder = req.query.folder;
    
    if (!folder) {
        return res.status(400).json({ error: '폴더 경로가 필요합니다.' });
    }
    
    try {
        const folderPath = path.join(__dirname, 'public', 'images', 'webp', path.basename(folder));
        
        if (!fs.existsSync(folderPath)) {
            console.error('폴더가 존재하지 않음:', folderPath);
            return res.status(404).json({ error: '폴더를 찾을 수 없습니다.' });
        }
        
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => file.endsWith('.webp'));
        const imagePaths = imageFiles.map(file => `/images/webp/${path.basename(folder)}/${file}`);
        
        res.json(imagePaths);
    } catch (error) {
        console.error(`폴더 읽기 오류: ${folder}`, error);
        res.status(500).json({ error: '폴더를 읽는 중 오류가 발생했습니다.' });
    }
});

// 404 에러 처리
app.use((req, res) => {
    res.status(404).send('페이지를 찾을 수 없습니다.');
});

// 서버 시작
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// 서버 종료 시 정리
process.on('SIGTERM', () => {
    console.log('서버 종료 중...');
    server.close(() => {
        console.log('서버가 종료되었습니다.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('서버 종료 중...');
    server.close(() => {
        console.log('서버가 종료되었습니다.');
        process.exit(0);
    });
}); 