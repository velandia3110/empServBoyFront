import { User } from './auth.model';

export type MultimediaType = 'TEXT' | 'IMAGE' | 'VIDEO';

export interface Multimedia {
  multimediaId: string;
  content: string | null;
  resourceUrl: string | null;
  type: MultimediaType;
  articleId: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithRelations {
  articleId: string;
  title: string;
  userId: string;
  created_at: string;
  updated_at: string;
  user: User;
  multimedia: Multimedia[];
}

export interface MultimediaBlock {
  multimediaId?: string;
  type: MultimediaType;
  content?: string;
  resourceUrl?: string;
  file?: File;
}
