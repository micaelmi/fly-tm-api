import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  //UserType
  const common = await prisma.userType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      description: "comum",
    },
  });
  const administrator = await prisma.userType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      description: "admin",
    },
  });
  console.log({ common, administrator });

  //VisibilityType
  const public_visibility = await prisma.visibilityType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      description: "Público",
    },
  });
  const private_visibility = await prisma.visibilityType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      description: "Privado",
    },
  });
  const only_club = await prisma.visibilityType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      description: "Apenas clube",
    },
  });
  console.log({ public_visibility, private_visibility, only_club });

  //ContactType
  const complaint = await prisma.contactType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      description: "Reclamação",
    },
  });
  const report = await prisma.contactType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      description: "Denúncia",
    },
  });
  const question = await prisma.contactType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      description: "Dúvida",
    },
  });
  const technical_support = await prisma.contactType.upsert({
    where: { id: 4 },
    update: {},
    create: {
      description: "Suporte técnico",
    },
  });
  const information_request = await prisma.contactType.upsert({
    where: { id: 5 },
    update: {},
    create: {
      description: "Solicitação de informação",
    },
  });
  const general_feedback = await prisma.contactType.upsert({
    where: { id: 6 },
    update: {},
    create: {
      description: "Feedback geral",
    },
  });
  const financial_matters = await prisma.contactType.upsert({
    where: { id: 7 },
    update: {},
    create: {
      description: "Assuntos financeiros",
    },
  });
  console.log({
    complaint,
    report,
    question,
    technical_support,
    information_request,
    general_feedback,
    financial_matters,
  });

  //HandGrip
  const shakehand = await prisma.handGrip.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Clássica",
      description:
        "Também conhecida como 'shakehand', essa empunhadura faz com que a raquete seja segurada como se estivesse apertando a mão de alguém. Ela permite transições fáceis entre forehand e backhand, sendo ideal para um estilo de jogo equilibrado e versátil.",
    },
  });
  const penhold = await prisma.handGrip.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Caneta",
      description:
        "Essa empunhadura se assemelha à maneira de segurar uma caneta, com os dedos curvados atrás da raquete. Ela oferece excelente controle e potência em golpes de forehand, sendo muito utilizada em estilos de jogo ofensivos e rápidos. Contudo, o backhand é mais limitado, exigindo maior habilidade para cobrir essa área.",
    },
  });
  const modern_penhold = await prisma.handGrip.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "Classineta",
      description:
        "Uma variação moderna da empunhadura caneta, ela mantém a mesma forma de segurar, mas permite o uso da parte traseira da raquete para golpes de backhand. Esse estilo combina a rapidez do caneta com a versatilidade do clássica, ampliando as possibilidades de ataque e defesa.",
    },
  });
  console.log({ shakehand, penhold, modern_penhold });

  //GameStyle
  const offensive = await prisma.gameStyle.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Ofensivo",
      description:
        "Esse estilo foca em ataques rápidos e potentes, priorizando golpes agressivos como drives e smashes para pressionar o adversário. Os jogadores geralmente jogam perto da mesa, buscando finalizar os pontos rapidamente.",
    },
  });
  const defense = await prisma.gameStyle.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Defensivo",
      description:
        "Caracterizado por um foco em devolver bolas consistentemente, muitas vezes com uso de spin (efeito) e cortes. Esses jogadores aguardam o erro do adversário e geralmente jogam mais distantes da mesa, com paciência e controle.",
    },
  });
  const allround = await prisma.gameStyle.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "Completo",
      description:
        "Jogadores desse estilo equilibram ataque e defesa, adaptando sua estratégia às condições do jogo. Eles são versáteis e conseguem alternar entre golpes potentes e defensivos conforme necessário.",
    },
  });
  const blocker = await prisma.gameStyle.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: "Bloqueador",
      description:
        "Esse estilo é baseado em bloquear os ataques do adversário, redirecionando a bola com precisão e controle. Os jogadores bloqueadores costumam jogar perto da mesa, frustrando o adversário com seu timing e consistência.",
    },
  });
  const spin_player = await prisma.gameStyle.upsert({
    where: { id: 5 },
    update: {},
    create: {
      title: "Efeito",
      description:
        "Jogadores que utilizam o spin como sua principal arma, aplicando diferentes tipos de efeito em golpes como topspin, sidespin e backspin para confundir e desequilibrar o adversário.",
    },
  });
  const counter_attacker = await prisma.gameStyle.upsert({
    where: { id: 6 },
    update: {},
    create: {
      title: "Contra-Atacante",
      description:
        "Focado em responder aos ataques do adversário com contra-ataques rápidos e potentes. Esses jogadores costumam usar a energia do golpe recebido para criar uma devolução ainda mais agressiva.",
    },
  });
  console.log({
    offensive,
    defense,
    allround,
    blocker,
    spin_player,
    counter_attacker,
  });

  //level
  const beginner = await prisma.level.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Iniciante",
      description:
        "Eventos destinados a jogadores que estão começando no tênis de mesa, com foco em aprendizado, diversão e introdução ao esporte.",
    },
  });
  const intermediate = await prisma.level.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Intermediário",
      description:
        "Projetados para jogadores que já possuem experiência básica e buscam aprimorar suas habilidades em competições mais desafiadoras.",
    },
  });
  const advanced = await prisma.level.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "Avançado",
      description:
        "Voltados para jogadores experientes que têm alto nível técnico e competem em torneios de maior intensidade e exigência.",
    },
  });
  const free = await prisma.level.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: "Livre",
      description:
        "Eventos abertos para todos os níveis de habilidade, onde jogadores de diferentes experiências podem participar juntos.",
    },
  });
  console.log({ beginner, intermediate, advanced, free });

  //Movement
  const forehand_drive = await prisma.movement.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Forehand Drive",
      description:
        "Um golpe ofensivo realizado com a face frontal da raquete, gerando velocidade e efeito topspin na bola. É usado para atacar bolas altas ou médias.",
      average_time: 1,
      image_url:
        "https://ttta.home.blog/wp-content/uploads/2019/02/forehand-drive.png",
      video_url:
        "https://www.youtube.com/embed/Abe_FicwtAE?si=nn27J2mfcsLYHeL7",
    },
  });
  const backhand_drive = await prisma.movement.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Backhand Drive",
      description:
        "Um golpe ofensivo similar ao forehand drive, mas realizado com a parte traseira da raquete, com foco em velocidade e controle.",
      average_time: 1,
      image_url:
        "https://www.experttabletennis.com/wp-content/uploads/2015/07/backhand-loop-table-tennis.jpg",
      video_url:
        "https://www.youtube.com/embed/50GsKWUxPCU?si=oFjBvytm-bHBeWay",
    },
  });
  const forehand_loop = await prisma.movement.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Forehand Loop",
      description:
        "Um golpe com forte topspin, executado com mais rotação do que velocidade, ideal para bolas com backspin ou de média altura.",
      average_time: 1,
      image_url:
        "https://i0.wp.com/tabletennisteacher.com/wp-content/uploads/2024/02/forehand_loop_in_table_tennis_2.jpg",
      video_url:
        "https://www.youtube.com/embed/gdU4l98m_hQ?si=zFOO8b4ADp_e4eqA",
    },
  });
  const backhand_loop = await prisma.movement.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Backhand Loop",
      description:
        "Um golpe ofensivo com muito spin, usado para atacar bolas com backspin no lado do backhand.",
      average_time: 1,
      image_url:
        "https://www.butterflyonline.com/wp-content/uploads/2021/05/2021-US-Team-Trials-285-scaled.jpg",
      video_url:
        "https://www.youtube.com/embed/CdjkbgcsN6s?si=DhOmbPdxnIhw_XFz",
    },
  });
  const forehand_smash = await prisma.movement.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: "Forehand Smash",
      description:
        "Um golpe rápido e potente, utilizado para finalizar pontos contra bolas altas e sem muito spin.",
      average_time: 1,
      image_url:
        "https://pingpongruler.com/wp-content/uploads/2024/04/image1.png",
      video_url:
        "https://www.youtube.com/embed/T8dHrFpZ8LA?si=yE-DCE28ZIJY6Tyw",
    },
  });
  const backhand_smash = await prisma.movement.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: "Backhand Smash",
      description:
        "Semelhante ao forehand smash, mas executado com o lado traseiro da raquete, usado para finalizar pontos com potência.",
      average_time: 1,
      image_url:
        "https://i0.wp.com/tabletennisteacher.com/wp-content/uploads/2022/07/how_to_backhand_smash_table_tennis.jpg",
      video_url:
        "https://www.youtube.com/embed/iIXz-8admqc?si=DPvqkwYhwBzFLiTH",
    },
  });
  const push = await prisma.movement.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: "Push",
      description:
        "Um golpe defensivo que mantém a bola baixa e curta na mesa, geralmente aplicado com backspin.",
      average_time: 2,
      image_url:
        "https://tabletennisteacher.com/wp-content/uploads/2022/07/how_to_backhand_push.jpg",
      video_url:
        "https://www.youtube.com/embed/4-gmcqYvZfQ?si=hqtsjGssmQQzC9c-",
    },
  });
  const block = await prisma.movement.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: "Block",
      description:
        "Um movimento defensivo realizado próximo à mesa para devolver ataques rápidos, usando o ângulo da raquete para redirecionar a bola.",
      average_time: 1,
      image_url:
        "https://www.butterflyonline.com/wp-content/uploads/2015/04/Han-Xiao-Butterfly-Writer.jpg",
      video_url:
        "https://www.youtube.com/embed/DNg6i4wQIa0?si=ZmfARFEI8GcrsMi9",
    },
  });
  const chop = await prisma.movement.upsert({
    where: { id: 9 },
    update: {},
    create: {
      name: "Chop",
      description:
        "Um golpe defensivo com backspin pesado, usado para desacelerar o jogo e neutralizar ataques. É realizado mais longe da mesa.",
      average_time: 2,
      image_url:
        "https://mytabletennis.net/forum/uploads/22009/wu_yang_24_10_10_11-26-14.jpg",
      video_url:
        "https://www.youtube.com/embed/gSSlb_5aEvk?si=ZvwURmQyOLT-rxD7",
    },
  });
  const flick = await prisma.movement.upsert({
    where: { id: 10 },
    update: {},
    create: {
      name: "Flick",
      description:
        "Um golpe ofensivo rápido e curto, usado para atacar bolas curtas na mesa, geralmente com topspin.",
      average_time: 1,
      image_url:
        "https://wttwebcmsprod.blob.core.windows.net/articledetailimages/Bruna-Takahashi-Banana_776aca78-b405-4533-89bf-46ae2691b72d.png",
      video_url:
        "https://www.youtube.com/embed/82ei5q-Wc9k?si=6cp-UQOIYsyv-1F2",
    },
  });
  const counter_drive = await prisma.movement.upsert({
    where: { id: 11 },
    update: {},
    create: {
      name: "Counter-Drive",
      description:
        "Um golpe ofensivo realizado para devolver ataques rápidos com igual velocidade e spin, mantendo o controle.",
      average_time: 1,
      image_url:
        "https://i0.wp.com/tabletennisteacher.com/wp-content/uploads/2022/07/counter_driver.jpg",
      video_url:
        "https://www.youtube.com/embed/-3O1JaVzMDw?si=k2w0Cke8CJOsf1wN",
    },
  });
  const lob = await prisma.movement.upsert({
    where: { id: 12 },
    update: {},
    create: {
      name: "Lob",
      description:
        "Um golpe defensivo em que a bola é enviada alta e com topspin, dificultando o ataque do oponente.",
      average_time: 2,
      image_url:
        "https://www.allabouttabletennis.com/images/xlob.jpg.pagespeed.ic.aoYXD99kW8.jpg",
      video_url:
        "https://www.youtube.com/embed/cSjgUoc198Q?si=LVc0uMNs-tn0HPbg",
    },
  });
  const drop_shot = await prisma.movement.upsert({
    where: { id: 13 },
    update: {},
    create: {
      name: "Drop Shot",
      description:
        "Um golpe sutil e preciso, usado para devolver bolas curtas, mantendo-as próximas à rede.",
      average_time: 1,
      image_url:
        "https://i.ytimg.com/vi/WoYGlv1adkQ/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AH-BIAC4AOKAgwIABABGD0gRihyMA8=&rs=AOn4CLC2XsSEGodUSW05a1pENyyFfuyT3g",
      video_url:
        "https://www.youtube.com/embed/P8h5VH3OzvI?si=bAQNsvXKXBSRKxlS",
    },
  });
  console.log({
    forehand_drive,
    backhand_drive,
    forehand_loop,
    backhand_loop,
    forehand_smash,
    backhand_smash,
    push,
    block,
    chop,
    flick,
    counter_drive,
    lob,
    drop_shot,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
