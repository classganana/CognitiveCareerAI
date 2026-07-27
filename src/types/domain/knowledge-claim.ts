import type { Types } from "mongoose";

import type { BaseEntity } from "./base";
import type {
  KnowledgeDomain,
  KnowledgeValidationStatus,
} from "./knowledge-domain";

export interface KnowledgeClaim extends BaseEntity {
  title: string;
  statement: string;
  domain: KnowledgeDomain;
  tags: string[];
  confidence: number;
  validationStatus: KnowledgeValidationStatus;
  archived: boolean;
  originCareerCaseId?: Types.ObjectId;
  evidenceIds: Types.ObjectId[];
}

export type CreateKnowledgeClaimInput = Pick<
  KnowledgeClaim,
  "title" | "statement" | "domain" | "tags" | "confidence" | "validationStatus"
> &
  Partial<Pick<KnowledgeClaim, "originCareerCaseId" | "evidenceIds" | "archived">>;

export type UpdateKnowledgeClaimInput = Partial<
  Pick<
    KnowledgeClaim,
    | "title"
    | "statement"
    | "domain"
    | "tags"
    | "confidence"
    | "validationStatus"
    | "archived"
  >
>;

export type KnowledgeClaimReference = Types.ObjectId | KnowledgeClaim;
