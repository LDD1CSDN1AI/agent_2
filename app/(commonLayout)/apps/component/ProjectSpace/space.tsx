// eslint-disable-next-line @next/next/no-img-element
import React, { useState } from "react";
import { Modal, Popover, Tag, message } from "antd";
import cn from "classnames";
import styles from "./spaceStyle.module.scss";
import { outProjectTenant } from "@/service/apps";
import { useAppContext } from '@/context/app-context'
import { getRedirection } from '@/utils/app-redirection'
import { useRouter } from 'next/navigation'
import { statusRole } from '@/utils/constant'
type Props = {
  data?: any;
  onOut?: () => void;
  setActiveTab?: any
  setActiveId?: any
};
const { confirm } = Modal;
// 个人空间卡片样式
const UserCard: React.FC<Props> = (props) => {
  const { data, onOut, setActiveTab, setActiveId } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isCurrentWorkspaceEditor } = useAppContext()
  const [itemId, setItemId] = useState('');
  const [role, setRole] = useState('');
  const { push } = useRouter()
  const outProject = async (item: any, isFales: string) => {
    const path = item.role === 'owner' ? `/deleteTenant?tenant_id=${item.id}` : `/outTenant?tenant_id=${item.id}`
    confirm({
      okText: '确定',
      cancelText: '取消',
      title: `确定${item.role === 'owner' ? '解散' : '退出'}该空间？`,
      content: `${item.role === 'owner' ? '解散项目空间后，项目成员被踢出项目空间，空间中的项目会被删除，且解散操作不可撤销' : '退出项目空间后，项目成员被踢出项目空间，空间中的项目会被删除，且退出操作不可撤销'}`,

      onOk: async () => {
        const res: any = await outProjectTenant({ url: path })
        if (res.result === "success") {
          message.info(`${item.role === 'owner' ? '解散' : '退出'}成功！`);
          onOut && onOut();
        } else if (res.result === 'error') {
          message.info(`${item.role === 'owner' ? res.result : res.result}`);
        }
      },
      onCancel() { },
    });
  };

  const editProject = (item: any) => {
    // onEdit(item);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCance = () => {
    setIsModalOpen(false);
  };
  const content = (item: any) => {
    return (
      <div className="w-[7vw] text-[#1C2748]" >
        {
          item.role === 'owner' ?
            <p
              className="h-[3vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] cursor-pointer"

              onClick={(e) => {
                e.preventDefault()
                setActiveTab?.('project-member');
                getRedirection(isCurrentWorkspaceEditor, {
                  tenant_id: item.id,
                  role: role,
                  mode: 'project-member'
                }, push)
              }}
            // onClick={(e) => {
            //   e.preventDefault()
            //   setActiveTab?.('ProjectMemberManagement');
            //   getRedirection(isCurrentWorkspaceEditor, {
            //     // ...item,
            //     mode: 'ProjectMemberManagement'
            //   }, push)
            // }}
            >
              成员管理
            </p> : ''
        }

        {
          item.role === 'owner' ? <p
            className="h-[3vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] text-[#E60808] cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              // setItemId(item.id)
              // setRole(item.role)
              outProject(item, 'jianshan')
            }}
          >
            解散
          </p> : <p
            className="h-[3vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] text-[#E60808] cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              // setItemId(item.id)
              // setRole(item.role)
              outProject(item, 'shancu')
            }}
          >
            退出
          </p>
        }
      </div>
    );
  };
  return (
    <>
      {data &&
        data.map((item: any) => {
          return (
            item.name !== '默认空间' && <div
              style={{ width: "440px", height: "174px" }}
              key={item.id}
              className={cn(
                "pl-[2vw] w-[25.8vw] h-[22vh] mb-[20px] bg-sky-80 border-[#E0E6EC]  border relative z-index-[9999] rounded-[8px]", styles.hoverCss,
              )}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveTab?.('workSpaceSecondPage');
                setActiveId?.(item);
                getRedirection(isCurrentWorkspaceEditor, {
                  ...item,
                  name: item.name,
                  tenant_id: item.id,
                  role: item.role,
                  mode: 'workSpaceSecondPage'
                }, push)
              }}
            >
              <div
                className="my-auto"
                onClick={(item: any) => editProject(item)}
              >
                <div className="flex pt-[21px]">
                  <img className='h-[5.5vh] align-top' src={`/agent-platform-web/bg/studyBase.png`} alt="" style={{ aspectRatio: '1/1', objectFit: 'cover', margin: '10px 10px 0px 0px' }} />

                  {/* <img className='w-[3.1vw] h-[5.5vh] mr-[0.93vw] align-top' src={'/agent-platform-web/bg/studyBase.png'} alt="" style={{ aspectRatio: '1/1', objectFit: 'cover', margin: '10px 10px 0px 0px' }} /> */}
                  <div className="mr-[9px]">
                    <div className="max-w-[14.8vw] color-[#1C2748] text-[20px] text-ellipsis overflow-hidden whitespace-nowrap">
                      {item.name}
                    </div>
                    <div className="">
                      <Tag color={statusRole(item.role)?.type} bordered={false}>{statusRole(item.role)?.role}</Tag>
                    </div>
                  </div>
                </div>
                <div
                  className={cn("w-[22.8vw] h-[5.1vh] text-[#1C2748] text-[12px] mt-[8px] mr-[24px] text-ellipsis overflow-hidden", styles.overflowText)}
                  style={{
                    display: "-webkit-box",
                    // lineClamp: 2,
                    boxOrient: "vertical",
                  }}
                >

                  {item.tenant_desc}
                </div>
                <div
                  className="absolute w-[2.08vw] h-[3.7vh] right-[15px] bottom-[15px] hover:bg-[#EEEEEE] rounded-[8px]"
                  style={{ lineHeight: "20px" }}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Popover content={() => content(item)} trigger="click">
                    <div className="text-[20px] text-center z-20">...</div>
                  </Popover>
                </div>
              </div>
            </div >
          );
        })}
    </>
  );
};

export default UserCard;
