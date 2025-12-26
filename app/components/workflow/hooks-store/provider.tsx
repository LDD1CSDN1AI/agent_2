import {
  createContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useStore } from 'reactflow'
import {
  createHooksStore,
} from './store'
import type { Shape } from './store'

type HooksStore = ReturnType<typeof createHooksStore>
export const HooksStoreContext = createContext<HooksStore | null | undefined>(null)
type HooksStoreContextProviderProps = Partial<Shape> & {
  children: React.ReactNode
}
export const HooksStoreContextProvider = ({ children, ...restProps }: HooksStoreContextProviderProps) => {
  const [storeReady, setStoreReady] = useState(false) // 用于确保store初始化完成
  const storeRef = useRef<HooksStore | undefined>(undefined)
  const d3Selection = useStore(s => s.d3Selection)
  const d3Zoom = useStore(s => s.d3Zoom)

  useEffect(() => {
    if (storeRef.current && d3Selection && d3Zoom)
      storeRef.current.getState().refreshAll(restProps)
    setStoreReady(true) // 确保store初始化后再渲染
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d3Selection, d3Zoom])
  if (!storeRef.current)
    storeRef.current = createHooksStore(restProps)

  return (
    <HooksStoreContext.Provider value={storeRef.current}>
      {children}
    </HooksStoreContext.Provider>
  )
}
