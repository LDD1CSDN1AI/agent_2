import GlobalUrl, { getPlatformType } from "@/GlobalUrl";
import ReleaseModal from './releaseModal/releaseModal'
import ReleaseModalCloud from './releaseModal/releaseModalCloud'



const ReleaseModalMerge: React.FC = (props: any) => {

    const platform_type = getPlatformType();

    return (
        <>
            {
                platform_type === 'shufa' &&
                <ReleaseModal {...props} />
            }
            {
                platform_type === 'wangyun' &&
                <ReleaseModalCloud {...props} />
            }
        </>
    )
}

export default ReleaseModalMerge;