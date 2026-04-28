import { Injectable } from '@nestjs/common';
import {
  BotFlowStep,
  BotSessionState,
  LeadDraft,
  ResultDraft,
} from './bot.types';

@Injectable()
export class BotStateService {
  private readonly sessions = new Map<string, BotSessionState>();

  getSession(userId: number | string): BotSessionState {
    return this.sessions.get(String(userId)) ?? {};
  }

  setStep(userId: number | string, step: BotFlowStep): void {
    const current = this.getSession(userId);
    this.sessions.set(String(userId), {
      ...current,
      step,
    });
  }

  setLeadDraft(userId: number | string, draft: LeadDraft): void {
    const current = this.getSession(userId);
    this.sessions.set(String(userId), {
      ...current,
      leadDraft: {
        ...current.leadDraft,
        ...draft,
      },
    });
  }

  setResultDraft(userId: number | string, draft: ResultDraft): void {
    const current = this.getSession(userId);
    this.sessions.set(String(userId), {
      ...current,
      resultDraft: {
        ...current.resultDraft,
        ...draft,
      },
    });
  }

  setMeta(userId: number | string, meta: Record<string, unknown>): void {
    const current = this.getSession(userId);
    this.sessions.set(String(userId), {
      ...current,
      meta: {
        ...(current.meta ?? {}),
        ...meta,
      },
    });
  }

  clear(userId: number | string): void {
    this.sessions.delete(String(userId));
  }
}
