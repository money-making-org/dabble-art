import React from "react";
import { AlertDialog, AlertDialogContent } from "./alert-dialog.js";
import { Button } from "./button.js";
import { Lock, X } from "lucide-react";

interface SignInRedirectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInRedirectModal({ open, onOpenChange }: SignInRedirectModalProps) {
  // Redirect helpers
  const handleSignIn = () => {
    window.location.href = "/auth/signin";
  };
  const handleSignUp = () => {
    window.location.href = "/auth/signup";
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col items-center gap-6 max-w-sm w-full p-8">
        <div className="relative w-full">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-0 right-0 p-2 rounded-full hover:bg-muted focus:outline-none cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-muted rounded-full p-4 flex items-center justify-center">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <div className="flex flex-col items-center w-full gap-2">
          <h2 className="text-lg font-semibold text-center">Sign in required</h2>
          <p className="text-sm text-muted-foreground text-center">Please sign in to continue</p>
        </div>
        <div className="flex flex-col w-full gap-3">
          <Button className="w-full" onClick={handleSignIn}>
            Sign in
          </Button>
          <Button className="w-full" variant="outline" onClick={handleSignUp}>
            Create account
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
} 