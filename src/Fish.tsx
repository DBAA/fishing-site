/**
 * 
 *  The fish class that contains all data that needs to get sent to game
 * 
 */

export default class Fish {
  colors: string[];
  body: {
    head: number[],
    dorsal: number[],
    ventral: number[],
    tail: number[],
    body: number[]
  }
  uuid: any; //what type are we using for uuid? TODO
  
  //TODO update
  constructor (colors: string[], body: {head: number[], dorsal: number[], ventral: number[], tail: number[], body: number[]}, uuid?: any) {
    this.colors = colors;
    this.body = body;
    this.uuid = uuid;
  }
}
