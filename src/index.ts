import {
  Extension,
  HDirection,
  HMessage,
  HEntity,
  HPacket,
  GAsync,
  AwaitingPacket,
} from "gnode-api";

const ext = new Extension({
  author: "",
  description: "",
  name: "",
  version: "",
});

let userId: number;

const gAsync = new GAsync(ext);
ext.run();

ext.interceptByNameOrHash(HDirection.TOCLIENT, "Users", async (hMessage) => {
  const awaitedPacket = await gAsync.awaitPacket(
    new AwaitingPacket("GetGuestRoomResult", HDirection.TOCLIENT, 1000)
  );

  if (!awaitedPacket) return;

  const entities = HEntity.parse(hMessage.getPacket());

  for (const entity of entities) {
    if (entity.id === userId) return;
    const packet = new HPacket("AvatarEffect", HDirection.TOCLIENT)
      .appendInt(entity.index)
      .appendInt(13)
      .appendInt(0);
    ext.sendToClient(packet);
  }
});

ext.interceptByNameOrHash(
  HDirection.TOCLIENT,
  "UserObject",
  (hMessage) => (userId = hMessage.getPacket().readInteger())
);
