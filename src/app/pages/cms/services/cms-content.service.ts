import { Injectable } from '@angular/core';

export type ContentType = 'TUTORIAL' | 'BLOG' | 'INSTRUCTIVO';
export type ContentStatus = 'Publicado' | 'Borrador';

export interface ContentItem {
  id: number;
  title: string;
  author: string;
  type: ContentType;
  publishDate: string | null;
  status: ContentStatus;
  imageUrl: string | null;
  description: string;
  category: string;
  videoLink: string;
}

@Injectable({ providedIn: 'root' })
export class CmsContentService {
  private nextId = 5;

  private items: ContentItem[] = [
    {
      id: 1,
      title: 'Introducción a Sistemas de Riego',
      author: 'Juan Pérez',
      type: 'TUTORIAL',
      publishDate: '12 Oct, 2023',
      status: 'Publicado',
      imageUrl: null,
      description: '',
      category: 'agua',
      videoLink: ''
    },
    {
      id: 2,
      title: 'Sostenibilidad en el Siglo XXI',
      author: 'Elena Santos',
      type: 'BLOG',
      publishDate: '10 Oct, 2023',
      status: 'Publicado',
      imageUrl: null,
      description: '',
      category: 'sostenibilidad',
      videoLink: ''
    },
    {
      id: 3,
      title: 'Gestión de Residuos Urbanos',
      author: 'Marco Ruiz',
      type: 'INSTRUCTIVO',
      publishDate: null,
      status: 'Borrador',
      imageUrl: null,
      description: '',
      category: 'residuos',
      videoLink: ''
    },
    {
      id: 4,
      title: 'Ciberseguridad para ONGs',
      author: 'Sofía Lara',
      type: 'TUTORIAL',
      publishDate: '08 Oct, 2023',
      status: 'Publicado',
      imageUrl: null,
      description: '',
      category: 'sostenibilidad',
      videoLink: ''
    }
  ];

  getAll(): ContentItem[] {
    return [...this.items];
  }

  add(item: Omit<ContentItem, 'id'>): ContentItem {
    const newItem: ContentItem = { ...item, id: this.nextId++ };
    this.items.unshift(newItem);
    return newItem;
  }

  delete(id: number): void {
    this.items = this.items.filter(i => i.id !== id);
  }
}
