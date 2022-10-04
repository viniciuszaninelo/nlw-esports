import express from 'express'
import cors from 'cors'

import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string'

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({
  log: ['query']
})

// HTTP method / API RESTFUL / HTTP Codes

app.get('/games', async (req,res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        }
      }
    }
  })

  return res.json(games);
});

app.post('/games/:id/ads', async (req, res) => {
  const gamesId = req.params.id;
  const body: any = req.body;

  const ad = await prisma.ad.create({
    data: {
      gamesId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChanne: body.useVoiceChanne,
    }
  })

  return res.status(201).json(ad);  
});

app.get('/games/:id/ads', async (req, res) => {
  const gamesId = req.params.id;

  const ads = await prisma.ad.findMany({
    select: { // quais campos eu quero que apareça
      id: true,
      name: true,
      weekDays: true,
      useVoiceChanne: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gamesId,
    },
    orderBy: { //ordenar a apartir dos anuncios mais recentes(ordem decrescente)
      createdAt: 'desc'
    }
  })
  return res.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd),
    }
  }))
})

app.get('/ads/:id/discord', async (req, res) => { 
  const adId = req.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: adId,
    }
  })

  return res.json({
    discord: ad.discord,
  })
})
app.listen(3333)