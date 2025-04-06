import { readdirSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const { folder } = req.query;
  
  if (!folder) {
    return res.status(400).json({ error: '폴더 경로가 필요합니다.' });
  }
  
  try {
    // 폴더 내의 모든 .webp 파일 가져오기
    const folderPath = join(process.cwd(), folder);
    const files = readdirSync(folderPath);
    
    // .webp 파일만 필터링
    const webpFiles = files.filter(file => file.endsWith('.webp'));
    
    // 파일 경로 반환
    const imagePaths = webpFiles.map(file => `${folder}/${file}`);
    
    return res.status(200).json(imagePaths);
  } catch (error) {
    console.error('폴더 읽기 오류:', error);
    return res.status(500).json({ error: '폴더를 읽는 중 오류가 발생했습니다.' });
  }
} 