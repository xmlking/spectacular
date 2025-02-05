CREATE TABLE user_notifications
(
  user_id         uuid        NOT NULL,
  notification_id uuid        NOT NULL,
  metadata        jsonb,                                       -- this could be used to personalize message template in notifications table, e.g., priority
  status          text        NOT NULL DEFAULT 'unread'::text, -- e.g., "unread", "read", "archived". filter unread,  make all as read
  created_at      timestamptz NOT NULL DEFAULT now(),          -- sent_at
  updated_at      timestamptz NOT NULL DEFAULT now(),          -- read_at
  PRIMARY KEY (user_id, notification_id),
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE CASCADE,
  FOREIGN KEY (notification_id) REFERENCES public.notifications (id) ON DELETE CASCADE,
  FOREIGN KEY (status) REFERENCES public.notification_status (value) ON UPDATE RESTRICT ON DELETE RESTRICT
);
COMMENT ON TABLE public.user_notifications IS 'Table containing User''s  Notifications collection';
---
CREATE TRIGGER set_public_user_notifications_updated_at
  BEFORE UPDATE
  ON public.user_notifications
  FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_notifications_updated_at ON public.user_notifications IS 'trigger to set value of column updated_at to current timestamp on row update';
---
