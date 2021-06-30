class JobsController < ApplicationController
  def create
    user = User.find_by(id: params[:userId])
    company = params[:company]
    title = params[:title]
    payFrequency = params[:payFrequency]
    payAmount = params[:payAmount]
    newJob = Job.create(company: company, title: title, pay_frequency: payFrequency, pay_amount: payAmount, user_id: user.id)
    render json: JobSerializer.new(newJob).to_serialized_json
  end

  def delete
    job = Job.find_by(id: params[:id])
    job.destroy

    render json: JobSerializer.new(job).to_serialized_json
  end
end
