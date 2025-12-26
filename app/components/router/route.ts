
// import { useRouter } from 'next/navigation'
export const pushBackHistory = (pathName:string, router: any) => {
   // const router = useRouter()
   console.log(pathName, 'wwwwwwwwwwwww', router)
   router.push(pathName)
}