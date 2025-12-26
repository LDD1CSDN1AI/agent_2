import { usePathname } from 'next/navigation'
type Btn = {
  val: string
  title: string
}
function BackBtn({ val, title }: Btn) {
  const pathName = usePathname()
  const routerRouter = () => {
    history.pushState(null, '', `${pathName}${val}`)
  }
  return (
    <span onClick={routerRouter}>{title}</span>
  )
}

export default BackBtn
