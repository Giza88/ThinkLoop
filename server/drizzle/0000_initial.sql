CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `display_name` text NOT NULL,
  `created_at` text NOT NULL
);

CREATE TABLE `user_settings` (
  `user_id` text PRIMARY KEY NOT NULL,
  `auto_save_drafts` integer NOT NULL,
  `show_prompts` integer NOT NULL,
  `require_approval` integer NOT NULL,
  `theme` text NOT NULL,
  `sidebar_collapsed` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `drafts` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `title` text NOT NULL,
  `preview` text NOT NULL,
  `document_json` text NOT NULL,
  `approval_status` text NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `history_entries` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `title` text NOT NULL,
  `action` text NOT NULL,
  `entity_id` text,
  `timestamp` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE INDEX `history_user_timestamp_idx` ON `history_entries` (`user_id`, `timestamp`);

CREATE TABLE `ideas` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `tags_json` text NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `integrations` (
  `user_id` text NOT NULL,
  `provider_id` text NOT NULL,
  `connected_at` text NOT NULL,
  PRIMARY KEY (`user_id`, `provider_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `workspace_sessions` (
  `user_id` text PRIMARY KEY NOT NULL,
  `thoughts_json` text NOT NULL,
  `document_json` text,
  `updated_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
