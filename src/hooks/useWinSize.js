import { useState, useCallback, useEffect } from 'react'

const useWinSize = () => {
  const [size, setSize] = useState({
    // width: document.documentElement.clientWidth,
    // height: document.documentElement.clientHeight
    width: window.innerWidth,
    height: window.innerHeight
  });

  // 使用useCallback，目的是为了缓存方法(useMemo 是为了缓存变量)
  const onResize = useCallback(() => {
    setSize({
      // width: document.documentElement.clientWidth,
      // height: document.documentElement.clientHeight
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, []);
  useEffect(() => {
    window.addEventListener('resize', onResize)
    // 移除事件监听
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize]);
  return size;
}

export default useWinSize