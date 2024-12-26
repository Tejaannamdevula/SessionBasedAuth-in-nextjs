"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import LogoutForm from "./LogoutForm";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export default function Navbar({ isAuthenticated }: NavbarProps) {
  return (
    <div className="w-full bg-gray-100 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Section Registration
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex space-x-4">
          <Link href="/api/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/api/signup">
            <Button variant="outline">Signup</Button>
          </Link>
          {isAuthenticated && <LogoutForm />}
        </div>
      </div>
    </div>
  );
}
