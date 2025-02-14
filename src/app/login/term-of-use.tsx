import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export function TermOfUseButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link href="" className="underline">
          Term of Use
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Term of use</DialogTitle>
          <DialogDescription>
            Please read our terms of use before using our services.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[200px]">
          <p>
            Welcome to our Smart Energy Home system. By accessing or using our
            services, you agree to be bound by the terms and conditions set
            forth below. Please read these terms carefully before using our
            services.
          </p>

          <br />
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using our services, you accept and agree to all terms,
            conditions, and notices contained or referenced herein. If you do
            not agree to these terms, do not use our services.
          </p>

          <br />
          <h2>2. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Any changes
            will be effective immediately upon posting on our website. Your
            continued use of our services following the posting of changes
            constitutes your acceptance of such changes.
          </p>

          <br />
          <h2>3. Use of Services</h2>
          <p>
            You agree to use our services only for lawful purposes. You must not
            use our services in any manner that could damage, disable,
            overburden, or impair our servers or networks, or interfere with any
            other party&apos;s use and enjoyment of our services.
          </p>

          <br />
          <h2>4. Intellectual Property</h2>
          <p>
            All content, including text, graphics, logos, images, and software,
            is the property of our company and is protected by copyright and
            other intellectual property laws. You may not reproduce, distribute,
            or create derivative works from any content without our express
            written permission.
          </p>

          <br />
          <h2>5. Limitation of Liability</h2>
          <p>
            We shall not be liable for any direct, indirect, incidental,
            special, or consequential damages resulting from the use or
            inability to use our services, including but not limited to damages
            for loss of profits, data, or other intangible losses.
          </p>

          <br />
          <h2>6. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which our company is headquartered,
            without regard to its conflict of law principles.
          </p>

          <br />
          <h2>7. Contact Information</h2>
          <p>
            If you have any questions about these terms, please contact us at
            (807)-BEST-SEV.
          </p>
        </ScrollArea>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
