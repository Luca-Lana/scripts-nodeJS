const axios = require('axios')
const cheerio = require('cheerio')
class lol {

  static async opggPlayer (nick) {
    try {
      const nickTratado = nick.replaceAll(' ', '%20')
      const result = await axios.get(`https://www.op.gg/summoners/br/${nickTratado}`)
      const $ = cheerio.load(result.data)
      const level = $('span.level').text()
      const iconePerfil = $('img[alt="profile image"]').attr('src')
      const rank = {}
      // pegar o rank
      $('div.header').each((index, tag) => {
        if(/Ranked/.test($(tag).text())) {
          if ($(tag).siblings().length === 0) {
            let fila = this.traduzirFila(/(.+)Unranked/.exec($(tag).text().split())[1])
            rank[fila] = 'sem rank'
          } else {
            let [ elo, eloNumber ] = $(tag).siblings('.content').find('.tier').text().split(' ')
            let pdl = /[0-9]{2}/.exec($(tag).siblings('.content').find('.lp').text())
            let fila = this.traduzirFila($(tag).text())
            rank[fila] = this.traduzirElo(elo) + ' ' + eloNumber + ' / ' + pdl + ' pdl'
          }
        }
      })

      return {
        iconePerfil,
        nick,
        level,
        rank,
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  static traduzirFila (fila) {
    fila = fila.toLowerCase()
    const filas = {
      'ranked solo': 'soloDuo', 
      'ranked flex': 'flex',
    }
    return filas[fila]
  }

  static traduzirElo (elo) {
    elo = elo.toLowerCase()
    const elos = {
      'iron' : 'ferro',
      'bronze' : 'bronze',
      'silver': 'prata',
      'gold' : 'ouro',
      'platinum' : 'platina',
      'diamond' : 'dimante',
      'master' : 'mestre',
      'grand master' : 'grão mestre',
      'challenger' : 'desafiante'
    }
    return elos[elo]
  }

  static async leagueOfGraphsPlayer (nick) {
    try {
      const nickTratado = nick.toLowerCase().replaceAll(' ', '+')
      const result = await axios.get(`https://www.leagueofgraphs.com/summoner/br/${nickTratado}#championsData-soloqueue`)
      const $ = cheerio.load(result.data)
      const level = /[0-9]+/.exec($('div.bannerSubtitle').text())[0]
      const iconePerfil = 'https:'+$('div.img').find('img').eq(0).attr('src')
      const rank = {}
      //soloDuo
      let [elo, eloNumber] = $('div[class="txt mainRankingDescriptionText"]').find('.leagueTier').text().trim().split(' ')
      rank['soloDuo'] = this.traduzirElo(elo) + ' ' + eloNumber + ' ' + $('div[class="txt mainRankingDescriptionText"]').find('.leaguePoints').text().trim()
      //flex
      console.log(rank)
      return {
        iconePerfil,
        nick,
        level,
        rank,
      }
    } catch (error) {
      console.log(error)
    }
  }

}

lol.leagueOfGraphsPlayer('Aluno do UCLA')