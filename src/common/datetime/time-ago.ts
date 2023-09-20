import JSTimeAgo from 'javascript-time-ago';
import lang from 'javascript-time-ago/locale/pt';

export class TimeAgo {

  public format(datetime: Date) {

    const timeAgo = new JSTimeAgo('pt-BR');
    return timeAgo.format(datetime);
  }
}

JSTimeAgo.addDefaultLocale(lang);