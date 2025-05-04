const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// 정적 파일 제공
app.use(express.static('.'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/svg', express.static(path.join(__dirname, 'svg')));

// 이미지 폴더에서 이미지 목록을 가져오는 API
app.get('/api/images', (req, res) => {
  const folderPath = req.query.folder;
  
  if (!folderPath) {
    return res.status(400).json({ error: '폴더 경로가 필요합니다.' });
  }

  const fullPath = path.join(__dirname, folderPath);
  
  try {
    const files = fs.readdirSync(fullPath);
    const imageFiles = files.filter(file => file.endsWith('.webp'));
    const imagePaths = imageFiles.map(file => path.join(folderPath, file));
    
    res.json({ images: imagePaths });
  } catch (error) {
    console.error(`폴더 읽기 오류: ${error.message}`);
    res.status(500).json({ error: '이미지 폴더를 읽을 수 없습니다.' });
  }
});

// 404 에러 처리
app.use((req, res) => {
  res.status(404).send('페이지를 찾을 수 없습니다.');
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 