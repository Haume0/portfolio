export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string | null;
  is_published: boolean;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  embeds: string[];
}

export interface FileData {
  buffer: Buffer;
  name: string;
}

export interface BlogData {
  title: string;
  content: string;
  embeds: FileData[];
  mdFileFound: boolean;
}
