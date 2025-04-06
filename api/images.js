import { readdirSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
    const { folder } = req.query;
    
    if (!folder) {
        return res.status(400).json({ error: '폴더 경로가 필요합니다.' });
    }
    
    try {
        // public 디렉토리 기준으로 경로 설정
        const folderPath = join(process.cwd(), 'public', folder);
        
        // 폴더 내의 모든 파일 목록 가져오기
        const files = readdirSync(folderPath);
        
        // .webp 파일만 필터링
        const imageFiles = files.filter(file => file.endsWith('.webp'));
        
        // 전체 경로로 변환
        const imagePaths = imageFiles.map(file => `/${folder}/${file}`);
        
        res.status(200).json(imagePaths);
    } catch (error) {
        console.error(`폴더 읽기 오류: ${folder}`, error);
        res.status(500).json({ error: '폴더를 읽는 중 오류가 발생했습니다.' });
    }
} 