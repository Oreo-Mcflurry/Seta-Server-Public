const axios = require("axios");
const cheerio = require("cheerio");

async function getImageUrl(value) {
  const url = `https://genius.com/artists/${value}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // user_avatar 클래스를 가진 div 요소 선택
    const avatarDiv = $(".user_avatar");
    console.log(avatarDiv);

    // style 속성에서 background-image 값 가져오기
    const styleAttribute = avatarDiv.attr("style");
    console.log(styleAttribute);
    const imageUrlMatch =
      styleAttribute && styleAttribute.match(/url\(([^)]+)\)/);
    var imageUrl = "";

    if (imageUrlMatch) {
      imageUrl = imageUrlMatch[1].replace(/["']/g, ""); // 따옴표 제거
      console.log("이미지 URL:", imageUrl);
    } else {
      console.log("이미지 URL을 찾을 수 없습니다.");
    }

    return imageUrl;
  } catch (error) {
    console.error("불러오기 중 오류 발생:", error.message);
    throw error;
  }
}


module.exports = getImageUrl;
