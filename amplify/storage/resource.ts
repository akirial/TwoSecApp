import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'amplifyTeamDrive',
    access: (allow) => ({
      'profile-pictures/{entity_id}/*': [
        allow.guest.to(['read', 'write']),
        allow.entity('identity').to(['read', 'write', 'delete'])
      ],
      'picture-submissions/*': [
        allow.authenticated.to(['read','write']),
        allow.guest.to(['read', 'write'])
      ],
      'profile-videos/{entity_id}/*': [
        allow.guest.to(['read']),
        allow.entity('identity').to(['read', 'write', 'delete']),
      ],
      // General video submissions: Both authenticated users and guests can view and upload
      'video-submissions/*': [
        allow.authenticated.to(['read', 'write']),
        allow.guest.to(['read', 'write']),
      ],
    })
  });