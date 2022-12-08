mkdir ./lambda_package
cp ./backend/src/lambda_function.py ./lambda_package/lambda_function.py
pip install -r ./backend/requirements.txt --target=./lambda_package
cd front && npm run build
cd ..
terraform apply
