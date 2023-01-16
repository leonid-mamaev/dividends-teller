pip install -r ./backend/requirements.txt --target=./terraform/lambda_package
cp -r ./backend/src ./terraform/lambda_package/src
npm --prefix ./front run build
rm -rf ./terraform/frontend_build
mv ./front/build ./terraform/frontend_build
terraform -chdir=terraform apply
