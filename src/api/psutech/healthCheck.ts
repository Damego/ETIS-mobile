import axios from 'axios';

class PsutechHealthCheck {
  private static readonly TIMEOUT = 3000;
  private static readonly BASE_URL = 'https://psutech.damego.ru';

  private isAvailable: boolean | null = null;
  private checkPromise: Promise<boolean> | null = null;

  async check(): Promise<boolean> {
    if (this.isAvailable !== null) {
      return this.isAvailable;
    }

    if (this.checkPromise) {
      return this.checkPromise;
    }

    console.log('[PsutechHealthCheck] Checking availability...');

    this.checkPromise = this.performCheck();
    const result = await this.checkPromise;
    this.checkPromise = null;

    return result;
  }

  private async performCheck(): Promise<boolean> {
    try {
      await axios.get(PsutechHealthCheck.BASE_URL, {
        timeout: PsutechHealthCheck.TIMEOUT,
        validateStatus: (status) => status < 500,
      });

      this.isAvailable = true;
      console.log('[PsutechHealthCheck] Service is available');
      return true;
    } catch (error) {
      this.isAvailable = false;
      console.warn('[PsutechHealthCheck] Service is unavailable:', error.message);
      return false;
    }
  }

  isServiceAvailable(): boolean | null {
    return this.isAvailable;
  }
}

const psutechHealthCheck = new PsutechHealthCheck();
export default psutechHealthCheck;

export const isPsutechAvailable = () => psutechHealthCheck.isServiceAvailable();
