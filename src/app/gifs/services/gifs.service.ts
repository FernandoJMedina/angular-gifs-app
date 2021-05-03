import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GifData, SearchGIFResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private baseUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = '9s421xDAGNe9r7OiSaXJoSKwygI21JYE';
  private _history: string[] = [];
  public results: GifData[] = [];

  get history() {
    return [...this._history];
  }

  constructor(private http: HttpClient) {
    this._history = JSON.parse(localStorage.getItem('search-history')!) || [];
    this.results = JSON.parse(localStorage.getItem('search-results')!) || [];
  }

  searchGifs(query: string) {
    query = query.trim().toLowerCase();
    if (!this._history.includes(query)) {
      this._history.unshift(query);
      localStorage.setItem('search-history', JSON.stringify(this._history));
      this._history = this._history.splice(0, 10);
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGIFResponse>(`${this.baseUrl}/search`, { params })
      .subscribe((res) => {
        this.results = res.data;
        localStorage.setItem('search-results', JSON.stringify(res.data));
      });
  }
}
