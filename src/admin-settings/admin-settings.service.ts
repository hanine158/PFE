import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminSetting } from './entities/admin-setting.entity';
import { UpdateAdminSettingsDto } from './dto/update-admin-setting.dto';

@Injectable()
export class AdminSettingsService {
  constructor(
    @InjectRepository(AdminSetting)
    private readonly adminSettingsRepository: Repository<AdminSetting>,
  ) {}

  async getSettings() {
    let settings = await this.adminSettingsRepository.findOne({
      where: { id: 1 },
    });

    if (!settings) {
      settings = this.adminSettingsRepository.create({
        id: 1,
        emailNotifications: true,
        pushNotifications: true,
        newUserAlert: true,
        courseAlert: true,
        paymentAlert: true,
        twoFactor: false,
        sessionTimeout: '30',
        loginAlerts: true,
        theme: 'dark',
        language: 'fr',
        compactMode: false,
        smtpServer: '',
        smtpPort: '587',
        senderEmail: '',
        senderPassword: '',
        backupFrequency: 'Quotidienne',
        lastBackup: '15 Mars 2024, 03:00',
        backupSize: '2.4 GB',
      });

      settings = await this.adminSettingsRepository.save(settings);
    }

    return settings;
  }

  async updateSettings(dto: UpdateAdminSettingsDto) {
    const settings = await this.getSettings();
    Object.assign(settings, dto);
    return await this.adminSettingsRepository.save(settings);
  }

  async runBackup() {
    const settings = await this.getSettings();
    const now = new Date();

    settings.lastBackup = now.toLocaleString('fr-FR');
    settings.backupSize = '2.4 GB';

    await this.adminSettingsRepository.save(settings);

    return {
      message: 'Sauvegarde lancée avec succès',
      lastBackup: settings.lastBackup,
      backupSize: settings.backupSize,
    };
  }
}