import { ErrorWithCustomMessage } from '@krezona/common-library';
import { producer } from './producer'; // Assuming you have a Kafka producer set up
import { MessageKey } from 'node-rdkafka';

export interface UserEvent {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  isStaff: boolean;
  permissionGroup: string | null;
  facebookId: string | null;
  googleId: string | null;
  version: number;
}
//works for both create and update permission
export interface PermissionEvent{
  id: string;
  profileName: string;
  permissions: object;
  version: number;
}

export interface DeletePermissionEvent{
  id: string;
}


export class UserEventPublisher {
  async publish(topic: string, data: UserEvent, Key: MessageKey): Promise<void> {
    if (Key === null || Key === undefined) {
      throw new ErrorWithCustomMessage(`Please supply a key`, 400);
    }
    try {
      producer.produce(
        topic, // The topic name
        null,
        Buffer.from(JSON.stringify(data)),
        Key, // Directly pass the key as a number
        Date.now()
      );
    } catch (err) {
      console.error('Failed to produce event:', err);
    }
  }
}

export class PermissionEventPublisher {
  async publish(topic: string, data: PermissionEvent, Key: MessageKey): Promise<void> {
    if (Key === null || Key === undefined) {
      throw new ErrorWithCustomMessage(`Please supply a key`, 400);
    }
    try {
      producer.produce(
        topic, // The topic name
        null,
        Buffer.from(JSON.stringify(data)),
        Key, // Directly pass the key as a number
        Date.now()
      );
    } catch (err) {
      console.error('Failed to produce event:', err);
    }
  }
}

export class DeletePermissionEventPublisher {
  async publish(topic: string, data: DeletePermissionEvent, Key: MessageKey): Promise<void> {
    if (Key === null || Key === undefined) {
      throw new ErrorWithCustomMessage(`Please supply a key`, 400);
    }
    try {
      producer.produce(
        topic, // The topic name
        null,
        Buffer.from(JSON.stringify(data)),
        Key, // Directly pass the key as a number
        Date.now()
      );
    } catch (err) {
      console.error('Failed to produce event:', err);
    }
  }
}