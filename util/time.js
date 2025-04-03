export const convertToTimeFormat = (timeSecond) =>{
    const minute = Math.floor(timeSecond/60);
    const second = timeSecond%60;
    
    return `${minute}:${second < 10 ? `0${second}` : second}`
}