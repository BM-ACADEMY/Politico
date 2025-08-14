import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {user?.profileImage && (
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user?.name
                  ? `${user.name.charAt(0)}${user.name.charAt(user.name.length - 1)}`
                  : ''}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="text-center">
            <h2 className="text-xl font-semibold">{user?.name || 'N/A'}</h2>
            <p className="text-muted-foreground">{user?.email || 'N/A'}</p>
          </div>
          <div className="grid gap-2 w-full max-w-md">
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{user?.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ward:</span>
              <span>{user?.ward || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;