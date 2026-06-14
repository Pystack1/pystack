# pystack
We are developing the online python class

frontend :

C:\Users\user\Downloads\pystack> npm install
C:\Users\user\Downloads\pystack> npm run dev
backend : step 1: cd backend step 2 : requirements install step 3 : python main.py

ports : frontend : 8080 backend : 8000

database :

database.py file change the credentials
logins :

create superadmin details by using register page and keep in users table is_activate = 1 by default 0 will be there for superadmin only remaining roles superadmin can operate.
roles table : insert 3 roles INSERT INTO roles (id, name) VALUES (1, 'SuperAdmin'), (2, 'Admin'), (3, 'User');
3.user_roles table : change the role_id =1 for user_id =1 of super admin because of by default it will be 3 for user
