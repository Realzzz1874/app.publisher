// 移出团队
export const format_message_removeTeam = (
  username: string,
  teamName: string
) => {
  return `${username} 已将您移出【${teamName}】`;
};

// 添加成员
export const format_message_addTeam = (username: string, teamName: string) => {
  return `${username} 已将您添加进【${teamName}】`;
};

// 离开团队
export const format_message_leaveTeam = (
  username: string,
  teamName: string
) => {
  return `${username} 已离开【${teamName}】`;
};

// 解散团队
export const format_message_dissolveTeam = (
  username: string,
  teamName: string
) => {
  return `${username} 已解散【${teamName}】`;
};
