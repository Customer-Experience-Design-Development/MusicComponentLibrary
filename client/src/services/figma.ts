import axios from 'axios';

interface FigmaConfig {
  accessToken: string;
  fileKey: string;
}

export class FigmaService {
  private accessToken: string;
  private fileKey: string;
  private baseUrl = 'https://api.figma.com/v1';

  constructor(config: FigmaConfig) {
    this.accessToken = config.accessToken;
    this.fileKey = config.fileKey;
  }

  private get headers() {
    return {
      'X-Figma-Token': this.accessToken,
    };
  }

  async getFile() {
    try {
      const response = await axios.get(`${this.baseUrl}/files/${this.fileKey}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Figma file:', error);
      throw error;
    }
  }

  async getComponentNodes(nodeIds: string[]) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/files/${this.fileKey}/nodes?ids=${nodeIds.join(',')}`,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching component nodes:', error);
      throw error;
    }
  }

  async getImageUrls(nodeIds: string[], format: 'svg' | 'png' = 'svg') {
    try {
      const response = await axios.get(
        `${this.baseUrl}/images/${this.fileKey}?ids=${nodeIds.join(',')}&format=${format}`,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching image URLs:', error);
      throw error;
    }
  }
} 