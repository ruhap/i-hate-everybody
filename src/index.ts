import { Extension, HDirection, HEntity, HPacket, HMessage } from "gnode-api";

const ext = new Extension({
  author: "",
  description: "",
  name: "",
  version: "",
});

ext.run();

let isRoomLoaded = false;
const users = new Set<number>();

const onUsers = (hMessage: HMessage) => {
  if (!isRoomLoaded) setTimeout(() => onUsers(hMessage), 100);
  const entities = HEntity.parse(hMessage.getPacket());

  entities.forEach((entity) => {
    if (!users.has(entity.index) && entity.index !== userId) {
      users.add(entity.index);
      const packet = new HPacket("AvatarEffect", HDirection.TOCLIENT)
        .appendInt(0)
        .appendInt(13)
        .appendInt(0);
      ext.sendToClient(packet);
    }
  });
};

ext.interceptByNameOrHash(HDirection.TOCLIENT, "Users", onUsers);

let userId: number;
ext.interceptByNameOrHash(
  HDirection.TOCLIENT,
  "UserObject",
  (hMessage) => (userId = hMessage.getPacket().readInteger())
);

ext.interceptByNameOrHash(
  HDirection.TOCLIENT,
  "GetGuestRoomResult",
  () => (isRoomLoaded = true)
);

ext.interceptByNameOrHash(
  HDirection.TOCLIENT,
  "Quit",
  () => (isRoomLoaded = false)
);
