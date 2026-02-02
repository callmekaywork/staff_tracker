CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "assistance_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"institution_name" varchar(255) NOT NULL,
	"institution_type" varchar(100) NOT NULL,
	"contact_person" varchar(255),
	"email_address" varchar(255),
	"phone_number" varchar(50),
	"beneficiary_name" varchar(255),
	"disability" boolean DEFAULT false,
	"disability_type" varchar(255),
	"race" varchar(100),
	"gender" varchar(50),
	"geo_type" varchar(50),
	"age_range" varchar(50),
	"needs_identified" text,
	"assistance_given" text,
	"value_rating" integer,
	"date_assisted" timestamp,
	"user_responsible" varchar(255),
	"province_state" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"company_position" text,
	"logged_in_at" timestamp with time zone DEFAULT now() NOT NULL,
	"logged_out_at" timestamp with time zone,
	"is_online" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"uID" text PRIMARY KEY NOT NULL,
	"firstname" text,
	"lastname" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'staff' NOT NULL,
	"image" text,
	"emailVerified" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "users_uID_unique" UNIQUE("uID"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_uID_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("uID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_users_uID_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("uID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_uID_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("uID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_status" ADD CONSTRAINT "user_status_userId_users_uID_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("uID") ON DELETE cascade ON UPDATE no action;