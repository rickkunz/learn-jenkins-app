pipeline {
    agent any

    environment {
      NETLIFY_SITE_ID = 'd5d69810-5d59-410f-8e72-99c902c84d61'
      NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }

    stages {
        stage('Build') {
          agent {
            docker {
              image 'node:18-alpine'
              reuseNode true
            }
          }
            steps {
                sh '''
                  echo 'Small change'
                  ls -la
                  node --version
                  npm --version
                  npm ci
                  npm run build
                  ls -la
                '''
            }
        }

        stage('Tests') {
          parallel {
            stage('Unit tests') {
              agent {
                docker {
                  image 'node:18-alpine'
                  reuseNode true
                }
              }

              steps {
                sh '''
                  echo "Test stage"
                  test -f build/index.html
                  npm test
                '''
              }
              post {
                always {
                  junit 'jest-results/junit.xml'
                }
              }
            }

            stage('E2E') {
              agent {
                docker {
                  image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                  reuseNode true
                }
              }

              steps {
                sh '''
                  npm install serve
                  node_modules/.bin/serve -s build &
                  sleep 20
                  npx playwright test --reporter=html
                '''
              }
              post {
                always {
                  publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Local', reportTitles: '', useWrapperFileDirectly: true])
                }
              }
            }
          }
        }

        stage('Deploy staging') {
          agent {
            docker {
              image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
              reuseNode true
            }
          }

          environment {
            CI_ENVIRONMENT_URL = 'STAGING_URL_TO-BE-SET'
          }

          steps {
            sh '''
              npm install netlify-cli node-jq
              node_modules/.bin/netlify --version
              echo "Deploying to staging. Site ID: $NETLIFY_SITE_ID"
              node_modules/.bin/netlify status
              node_modules/.bin/netlify deploy --dir=build --json > deploy-output.json
              CI_ENVIRONMENT_URL=$(node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json)
              npx playwright test --reporter=html
            '''
          }
          post {
            always {
              publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Staging E2E', reportTitles: '', useWrapperFileDirectly: true])
            }
          }
        }

        stage('Approval') {
            steps {
                    timeout(time:15, unit: 'MINUTES') {
                    input message: 'Do you wish to deploy to production?', ok: 'Yes, I am sure!'
                }
            }
        }

        stage('Deploy prod') {
          agent {
            docker {
              image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
              reuseNode true
            }
          }

          environment {
            CI_ENVIRONMENT_URL = 'https://incomparable-lily-aea481.netlify.app'
          }

          steps {
            sh '''
              node --version
              npm install netlify-cli
              node_modules/.bin/netlify --version
              echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
              node_modules/.bin/netlify status
              node_modules/.bin/netlify deploy --dir=build --prod
              npx playwright test --reporter=html
            '''
          }
          post {
            always {
              publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Prod E2E', reportTitles: '', useWrapperFileDirectly: true])
            }
          }
        }
    }
}